function getServerIp(id, token) {
    var decrypted = CryptoJS.AES.decrypt(token, id);
    try {
      var res = decrypted.toString(CryptoJS.enc.Utf8);
    }
    catch(err) { /* malformed URL */
      return ""
    }
    if (!res.includes("http")) {
        return "";
    } else {
        return res;
    }
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


