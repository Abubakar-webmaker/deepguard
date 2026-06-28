from fastapi import APIRouter, Depends, Query
from routers.auth import get_current_user
from core.database import get_db
from typing import Optional

router = APIRouter(prefix="/history", tags=["history"])

@router.get("/")
async def get_history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    type: Optional[str] = None,
    verdict: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    db = get_db()
    query = {"user_id": current_user["_id"]}
    if type and type != "all":
        query["type"] = type
    if verdict and verdict != "all":
        query["verdict"] = verdict

    total = await db.scans.count_documents(query)
    skip = (page - 1) * limit

    cursor = db.scans.find(query).sort("timestamp", -1).skip(skip).limit(limit)
    scans = []
    async for doc in cursor:
        scans.append({
            "id": doc["_id"],
            "type": doc["type"],
            "file_name": doc.get("file_name"),
            "verdict": doc["verdict"],
            "confidence": doc["confidence"],
            "ai_probability": doc["ai_probability"],
            "analysis_time": doc.get("analysis_time", 0),
            "timestamp": doc["timestamp"].isoformat()
        })

    return {
        "scans": scans,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }

@router.get("/stats")
async def get_stats(current_user=Depends(get_current_user)):
    db = get_db()
    uid = current_user["_id"]

    total = await db.scans.count_documents({"user_id": uid})
    fake = await db.scans.count_documents({"user_id": uid, "verdict": "fake"})
    real = await db.scans.count_documents({"user_id": uid, "verdict": "real"})

    pipeline = [
        {"$match": {"user_id": uid}},
        {"$group": {"_id": None, "avg_time": {"$avg": "$analysis_time"}}}
    ]
    avg_result = await db.scans.aggregate(pipeline).to_list(1)
    avg_time = round(avg_result[0]["avg_time"], 2) if avg_result else 0

    return {
        "total": total,
        "fake": fake,
        "real": real,
        "avg_analysis_time": avg_time,
        "fake_percentage": round((fake / total * 100) if total else 0, 1)
    }

@router.delete("/{scan_id}")
async def delete_scan(scan_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    result = await db.scans.delete_one({"_id": scan_id, "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"message": "Deleted successfully"}