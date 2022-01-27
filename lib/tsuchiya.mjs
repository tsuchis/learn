import fetch from "node-fetch";
//const fetch = require("node-fetch");

// base64エンコード/デコードツール
// https://www.en-pc.jp/tech/base64.php
// 例：ログイン名が「Administrator」、パスワードが「cybozu」の場合
// 「Administrator:cybozu」 → QWRtaW5pc3RyYXRvcjpjeWJvenU=

export const fetchKintoneUsers = async (AuthKey, size = 100, offset = 0) => {
  let records = [];

  const params = `offset=${offset}&size=${size}`;
  const url = "https://michiwa.cybozu.com/v1/users.json?" + params;

  const response = await fetch(url, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-Cybozu-Authorization": AuthKey,
      Authorization: `Basic ${AuthKey}`,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    console.error(response);
    console.error(json);
    return [];
  }

  if (json.users.length === size) {
    const subRecords = await fetchKintoneUsers(AuthKey, size, offset + size);
    records = records.concat(subRecords);
  }

  records = records.concat(json.users);
  return records;
};

export const fetchKintoneOrganizations = async (
  appKey,
  size = 100,
  offset = 0
) => {
  let records = [];

  const params = `offset=${offset}&size=${size}`;
  const url = "https://michiwa.cybozu.com/v1/organizations.json?" + params;

  const response = await fetch(url, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-Cybozu-API-Token": appKey,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    console.error(json);
    return [];
  }

  if (json.organizations.length === size) {
    const subRecords = await fetchKintoneOrganizations(
      appKey,
      size,
      offset + size
    );
    records = records.concat(subRecords);
  }

  records = records.concat(json.organizations);
  return records;
};

export const fetchKintoneRecords = async (
  appId = kintone.app.getId(),
  appKey,
  query = "",
  fields = [],
  limit = 500,
  offset = 0
) => {
  let records = [];

  const params =
    "app=" +
    appId +
    "&query=" +
    encodeURIComponent(query + " limit " + limit + " offset " + offset) +
    "&totalCount=true";
  const url = "https://michiwa.cybozu.com/k/v1/records.json?" + params;

  const response = await fetch(url, {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-Cybozu-API-Token": appKey,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    console.error(json);
    return [];
  }

  if (Number(json.totalCount) < offset + limit) {
    records = records.concat(json.records);
    return records;
  } else {
    const subRecords = await fetchKintoneRecords(
      appId,
      appKey,
      query,
      fields,
      limit,
      offset + limit
    );
    records = records.concat(subRecords);
  }

  return records;
};

export const shortCustmerName = (name) => {
  name = name || "";
  const changedName = name
    .replace("株式会社", "")
    .replace("有限会社", "")
    .replace("一般社団法人", "")
    .replace("公益社団法人", "")
    .replace("医療法人社団", "")
    .replace("公益財団法人", "")
    .replace(" ", "");
  return changedName;
};

export const fetchSansanBizCards = async (
  apikey,
  companyName,
  nextPageToken
) => {
  const baseUrl = "https://api.sansan.com/v3.2/";
  const url = baseUrl + "bizCards/search";
  let params = `companyName=${encodeURI(companyName)}&range=all&limit=300`;

  if (nextPageToken) {
    params = "&nextPageToken=" + nextPageToken;
  }

  const headers = { "X-Sansan-Api-Key": apikey };

  const response = await fetch(url + "?" + params, {
    headers: headers,
  });

  const json = await response.json();
  console.log(json);

  let resData = json.data;
  if (json.hasMore) {
    const subData = await fetchSansanBizCards(
      apikey,
      companyName,
      nextPageToken,
      json.nextPageToken
    );
    resData = resData.concat(subData);
  }

  return resData;
};
