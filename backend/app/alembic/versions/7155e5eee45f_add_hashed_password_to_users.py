from alembic import op
import sqlalchemy as sa

revision = "add_hashed_password_users"
down_revision = "55ea38bdd699"
branch_labels = None
depends_on = None

def upgrade():
    op.add_column(
        "users",
        sa.Column("hashed_password", sa.String(), nullable=False)
    )

def downgrade():
    op.drop_column("users", "hashed_password")
