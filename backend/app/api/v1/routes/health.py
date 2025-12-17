from app.core.schemas import APIResponse, Meta

def health_check():
    return APIResponse(
        success=True,
        data={
            "status": "ok",
            "service": "SkillSync API"
        },
        meta=Meta()
    )
