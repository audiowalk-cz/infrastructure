import { ApiProperty } from "@nestjs/swagger";

export class ProjectFileDto {
  @ApiProperty() name: string;
  @ApiProperty() sizeBytes: number;
  @ApiProperty() lastModified: string;
}
