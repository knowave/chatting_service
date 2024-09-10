import { IsEmail, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[가-힣a-zA-Z]{2,10}$/, {
    message: '이름은 한글, 영문 2~10자로 입력해주세요',
  })
  username: string;

  @IsString()
  @Matches(/^[가-힣a-zA-Z]{2,20}$/, {
    message: '닉네임은 한글, 영문 2~20자로 입력해주세요',
  })
  nickname: string;

  @Matches(
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    {
      message:
        '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함한 8~20자로 입력해주세요',
    },
  )
  password: string;
}
