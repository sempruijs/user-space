use crate::db::*;
use crate::StatusCode;
use crate::User;
use sqlx::PgPool;

pub async fn create_user_handler(
    user: User,
    pool: PgPool,
) -> Result<impl warp::Reply, warp::Rejection> {
    match create_user(&pool, user).await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(_) => panic!("error while listing users"),
    }
}

pub async fn list_users_handler(pool: PgPool) -> Result<impl warp::Reply, warp::Rejection> {
    match read_users(&pool).await {
        Ok(users) => Ok(warp::reply::json(&users)),
        Err(_) => panic!("error while listing users"),
    }
}
