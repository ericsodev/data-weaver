import { sha256 } from "js-sha256"
type User = {
    username: string;
    password_hash: string;
}


const userDb: User[] = [{ username: "admin", password_hash: sha256("pass") }]

export function findUser(username: string): Promise<User | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = userDb.filter(user => user.username === username)
            if (users.length === 0) {
                resolve(null)
            } else {
                resolve(users[0])
            }
        }, 300)
    })
}

export function insertUser(username: string, password: string): Promise<Pick<User, "username"> | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = userDb.filter(user => user.username === username)
            if (users.length === 0) {
                userDb.push({ username, password_hash: sha256(password) })
                resolve({ username })
            } else {
                resolve(null)
            }
        }, 300)
    })
}
