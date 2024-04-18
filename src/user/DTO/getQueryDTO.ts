import {IsNumber } from 'class-validator';
export class GetQueryDTO {
  @IsNumber()
  readonly start: number;

  @IsNumber()
  readonly end: number;
}