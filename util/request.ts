import type { Readable } from "node:stream";
import { stringify } from "query-string";

interface RequestOptions {
  method: "get" | "post" | "put";
  headers?: HeadersInit;
  body?: BodyInit;
}

// TODO: accomodate non-JSON requests
const request = async (url: string, options: RequestOptions) => {
  const ops: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (options.body) {
    ops.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, ops);
  const data: any = await response.json();

  return response.ok ? data : Promise.reject(data);
};

export const get = async (
  url: string,
  params: object = {},
  headers?: HeadersInit
) => {
  return await request(
    `${url}?${stringify(params, { arrayFormat: "comma" })}`,
    {
      method: "get",
      headers,
    }
  );
};

export const post = async (url: string, body: any, headers?: HeadersInit) => {
  return await request(url, {
    method: "post",
    body,
    headers,
  });
};

export const getBuffer = async (readable: Readable) => {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
};
