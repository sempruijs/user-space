use dotenv::dotenv;
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;

//TODO: make age u32
#[derive(Debug)]
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

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new().connect(&database_url).await?;

    let users = get_users(&pool).await?;
    println!("{:#?}", users);

    Ok(())
}
