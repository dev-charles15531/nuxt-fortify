import { useNuxtApp } from "#app";
import type { $Fetch } from "ofetch";

/**
 * Returns a reference to the $fortifyApi property of the nuxt runtime app.
 *
 * This function is used to fetch data from the Fortify API.
 *
 * @returns {$Fetch} A reference to the $fortifyApi property of the nuxt runtime app.
 */
export const useApi = (): $Fetch => {
  const api = useNuxtApp().$fortifyApi;

  return api as $Fetch;
};
