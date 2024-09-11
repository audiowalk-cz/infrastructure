export class CdnClient {
  constructor(private readonly client: AxiosInstance) {}

  async getOpenAPI(): Promise<OpenAPIObject> {
    const response = await this.client.get("/openapi.json");

    return response.data;
  }
}
