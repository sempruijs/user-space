use dotenv::dotenv;
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;
use warp::http::StatusCode;
use warp::Filter;

use crate::db::*;
use crate::handlers::*;

pub mod db;
pub mod handlers;

//TODO: make age u32
#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct User {
    name: String,
    age: i32,
    email: String,
}

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new().connect(&database_url).await?;

    // Clone the pool to share it across routes
    let pool_filter = warp::any().map(move || pool.clone());

    // POST /users - Create a new user
    let create_user = warp::post()
        .and(warp::path("users"))
        .and(warp::body::json())
        .and(pool_filter.clone())
        .and_then(create_user_handler);

    // GET /users - Get all users
    let list_users = warp::get()
        .and(warp::path("users"))
        .and(pool_filter.clone())
        .and_then(list_users_handler);

    // PUT /users/:id - Update a user
    // let update_user = warp::put()
    //     .and(warp::path!("users" / i32))
    //     .and(warp::body::json())
    //     .and(pool_filter.clone())
    //     .and_then(update_user_handler);

    // DELETE /users/:id - Delete a user
    // let delete_user = warp::delete()
    //     .and(warp::path!("users" / i32))
    //     .and(pool_filter.clone())
    //     .and_then(delete_user_handler);

    // Combine all the routes
    let routes = create_user.or(list_users);

    // Start the server
    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;

    Ok(())
}
