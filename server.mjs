import {
  fetchKintoneRecords,
  fetchSansanBizCards,
  shortCustmerName,
} from "./lib/tsuchiya.mjs";

import http from "http";

// base64エンコード/デコードツール
// https://www.en-pc.jp/tech/base64.php
// 例：ログイン名が「Administrator」、パスワードが「cybozu」の場合
// 「Administrator:cybozu」 → QWRtaW5pc3RyYXRvcjpjeWJvenU=
const AuthKey = "cy50c3VjaGl5YUBtaWNoaXdhLmNvLmpwOm5ZUlpVcmU0";

const kintoneApps = {
  顧客情報: {
    id: 43,
    apiKey: "dXcZEp3RyU5jT1ppnGkEvNVXAgnnK1lkNpId7SrC",
  },
  SANSAN: {
    apiKey: "4d13f8fe75954be4897265e0fd606b0f",
  },
};

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.write("<h1>Hello Worlaaad</h1>");

  const customerName = "オープンハウス";
  const bizCards = await fetchSansanBizCards(
    kintoneApps.SANSAN.apiKey,
    customerName
  );
  console.log(bizCards);
  res.write(JSON.stringify(bizCards));

  const customers = await fetchKintoneRecords(
    kintoneApps.顧客情報.id,
    kintoneApps.顧客情報.apiKey
  );

  const companyId = JSON.parse(body).data[0].companyId;
  window.open(
    `https://ap.sansan.com/v/Home/#/v/companies/${companyId}/`,
    "_blank"
  );
  customers.res.write(JSON.stringify(customers));

  res.end();
});

const port = 8080;
server.listen(port);
console.log("Server listen on port " + port);
