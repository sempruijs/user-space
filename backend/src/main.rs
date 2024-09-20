use dotenv::dotenv;
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;
use warp::http::StatusCode;
use warp::Filter;

//TODO: make age u32
#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct User {
    name: String,
    age: i32,
    email: String,
}

async fn get_users(pool: &PgPool) -> Result<Vec<User>, sqlx::Error> {
    let users = sqlx::query_as!(User, r#"SELECT name, age, email FROM users"#)
        .fetch_all(pool)
        .await?;

    Ok(users)
}

async fn delete_user(pool: &PgPool, id: i32) -> Result<(), sqlx::Error> {
    let result = sqlx::query!(
        r#"
        DELETE FROM users
        WHERE id = $1
        "#,
        id
    )
    .execute(pool)
    .await?;

    if result.rows_affected() == 0 {
        println!("No user found with id {}", id);
    }

    Ok(())
}

async fn add_user(pool: &PgPool, u: User) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        INSERT INTO users (name, age, email)
        VALUES ($1, $2, $3)
        "#,
        u.name,
        u.age,
        u.email
    )
    .execute(pool)
    .await?;

    Ok(())
}

async fn update_user(pool: &PgPool, id: i32, u: &User) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        UPDATE users
        SET name = $1, age = $2, email = $3
        WHERE id = $4
        "#,
        u.name,
        u.age,
        u.email,
        id
    )
    .execute(pool)
    .await?;

    Ok(())
}

async fn create_user_handler(
    user: User,
    pool: PgPool,
) -> Result<impl warp::Reply, warp::Rejection> {
    match add_user(&pool, user).await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(_) => panic!("error while listing users"),
    }
}

async fn list_users_handler(pool: PgPool) -> Result<impl warp::Reply, warp::Rejection> {
    match get_users(&pool).await {
        Ok(users) => Ok(warp::reply::json(&users)),
        Err(_) => panic!("error while listing users"),
    }
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
