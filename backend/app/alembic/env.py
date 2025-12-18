from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# ===============================
# IMPORT APP CONFIG & DATABASE
# ===============================
from app.core.config import settings
from app.core.database import Base

# ===============================
# IMPORT ALL MODELS (CRITICAL)
# ===============================
from app.models.user import User
from app.models.progress import LearningProgress
from app.models.flashcard import Flashcard

# Alembic Config object
config = context.config

# Override DB URL using Docker env
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Logging config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Tell Alembic which tables to track
target_metadata = Base.metadata


def run_migrations_offline():
    """Run migrations without DB connection"""
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations WITH DB connection"""
    connectable = engine_from_config(
        {"sqlalchemy.url": settings.DATABASE_URL},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
