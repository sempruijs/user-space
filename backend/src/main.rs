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

async fn add_user(pool: &PgPool, u: &User) -> Result<(), sqlx::Error> {
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

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new().connect(&database_url).await?;

    let users = get_users(&pool).await?;
    println!("{:#?}", users);

    delete_user(&pool, 4).await?;
    Ok(())
}
