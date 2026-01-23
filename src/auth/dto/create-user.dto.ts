import { IsEmail, IsString, Matches, Max, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?_&])[A-Za-z\d@$!%*?_&]{6,}$/,
        { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character' }
    )
    password: string;

     @IsString()
     @MinLength(1)
    fullName: string;
}