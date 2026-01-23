import { Injectable } from "@nestjs/common";
import { PasswordHasherPort } from "./ports/password-hasher.ports";
import * as bcrypt from 'bcrypt'


@Injectable()
export class PasswordHasherService implements PasswordHasherPort{
    hash (password: string): Promise<string> {
        return bcrypt.hash(password, 12)
    }

    compare(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash)
    }
}