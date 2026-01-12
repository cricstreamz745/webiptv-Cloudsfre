export default {
  async fetch(request, env) {
    try {
      const NZ_JSON_URL = "https://raw.githubusercontent.com/cricstreamz745/Web-Iptv/refs/heads/main/nz.json";

      const res = await fetch(NZ_JSON_URL);
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return new Response("Invalid JSON from nz.json", { status: 500 });
      }

      if (!data.channels || !Array.isArray(data.channels)) {
        return new Response("channels[] not found", { status: 500 });
      }

      let output = [];

      for (const ch of data.channels) {
        const headers = {
          "Referer": "https://webiptv.site/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "Origin": "https://webiptv.site",
          "Connection": "keep-alive",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "Pragma": "no-cache",
          "Cache-Control": "no-cache"
        };

        let mpd = "";

        try {
          const r = await fetch(ch.fetch_url, { headers });
          mpd = await r.text();
        } catch (e) {
          mpd = "";
        }

        output.push({
          name: ch.name,
          thumb: ch.thumb,
          mpd: mpd,
          kid: ch.kid,
          key: ch.key
        });
      }

      return new Response(JSON.stringify(output, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (err) {
      return new Response("Worker crash: " + err.message, { status: 500 });
    }
  }
};
