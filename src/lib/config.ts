
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig() || {};

export const YANDEX_MAP_API_KEY = publicRuntimeConfig?.YANDEX_MAP_API_KEY || "";
