export class postRequestConfig {
  query: string;
  variables: {
    login?: string;
    repo?: string;
  };
}
export class getRequestConfig {
  q?: string;
  page?: string;
}
