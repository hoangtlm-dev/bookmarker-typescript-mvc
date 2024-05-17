export type RequestOptions = {
  method: string;
  headers: Record<string, string>;
  body: FormData | string | null;
};

export type ImgBBImageDetails = {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
};

export type ImgBBData = {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: string;
  height: string;
  size: string;
  time: string;
  expiration: string;
  image: ImgBBImageDetails;
  thumb: ImgBBImageDetails;
  medium: ImgBBImageDetails;
  delete_url: string;
};

export type ImgBBApiResponse = {
  data: ImgBBData;
  success: boolean;
  status: number;
};
