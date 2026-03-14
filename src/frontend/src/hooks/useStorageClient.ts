import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

const SENTINEL = "!caf!";

export function imageIdToUrl(imageId: string): string {
  // If it's already a direct URL (not a hash), return as-is
  if (imageId.startsWith("http") || imageId.startsWith("/assets")) {
    return imageId;
  }
  return imageId;
}

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { identity } = useInternetIdentity();

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      setUploading(true);
      setProgress(0);
      try {
        const config = await loadConfig();
        const agent = new HttpAgent({
          identity: identity ?? undefined,
          host: config.backend_host,
        });
        if (config.backend_host?.includes("localhost")) {
          await agent.fetchRootKey().catch(() => {});
        }
        const storageClient = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        const bytes = new Uint8Array(await file.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (pct) => {
          setProgress(pct);
        });
        return SENTINEL + hash;
      } finally {
        setUploading(false);
      }
    },
    [identity],
  );

  return { uploadImage, uploading, progress };
}

export async function resolveImageUrl(imageId: string): Promise<string> {
  if (!imageId) return "";
  if (imageId.startsWith("http") || imageId.startsWith("/assets")) {
    return imageId;
  }
  if (imageId.startsWith(SENTINEL)) {
    const hash = imageId.substring(SENTINEL.length);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      return storageClient.getDirectURL(hash);
    } catch {
      return "";
    }
  }
  return imageId;
}
