export interface Template {
  id: number;
  templateName: string;
  type: "regular" | "promotional";
  jsonUrl: string;
  htmlUrl: string;
  createdAt: string;
  updateAt: string;
}
