
// This file is used to expose environment variables to the client-side code.
// By explicitly importing from this file, we ensure that the bundler (like Webpack)
// correctly includes these values in the client bundle.

// It's a more reliable way than directly using process.env in client components,
// which can sometimes be optimized away or fail to update correctly.

export const YANDEX_MAP_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY || "";
