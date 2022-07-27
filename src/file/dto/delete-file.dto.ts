import { IsNotEmpty } from 'class-validator';
export class DeleteFileDto {
  @IsNotEmpty()
  id: string;
}
