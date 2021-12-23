import React from "react";
import { LocalStorageKey } from "./config";

export default class AuthService extends React.Component {
  constructor() {
    super();
    this.domain = "http://" + document.domain + ":8080";

    this.token =
      localStorage.getItem(LocalStorageKey) !== null
        ? JSON.parse(localStorage.getItem(LocalStorageKey)).t
        : null;
    this.info =
      localStorage.getItem(LocalStorageKey) !== null
        ? JSON.parse(localStorage.getItem(LocalStorageKey)).u
        : null;
  }

  login(userData) {
    return new Promise((resolve, reject) => {
      fetch(`${this.domain}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: userData,
      })
        .then((res) => {
          return res.json();
        })
        .then((resJson) => {
          resolve(resJson);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  postData(url, userData) {
    return new Promise((resolve, reject) => {
      try {
        fetch(`${this.domain}${url}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-info": JSON.stringify(this.info),
            "x-access-token": this.token,
          },
          body: userData,
        })
          .then((res) => {
            return res.json();
          })
          .then((resJson) => {
            resolve(resJson);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        reject("发生错误!");
      }
    });
  }

  downloadPublicFile(url, data) {
    return new Promise((resolve, reject) => {
      try {
        fetch(`${this.domain}${url}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: data,
        }).then((res) => {
          resolve(res);
        });
      } catch (error) {
        reject("发生错误!");
      }
    });
  }

  uploadFile(url, data) {
    return new Promise((resolve, reject) => {
      try {
        fetch(`${this.domain}${url}`, {
          method: "POST",
          headers: {
            "x-access-info": JSON.stringify(this.info),
            "x-access-token": this.token,
          },
          body: data,
        })
          .then((res) => res.json())
          .then((resJson) => {
            resolve(resJson);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        reject("发生错误!");
      }
    });
  }

  downloadFile(url, data) {
    return new Promise((resolve, reject) => {
      try {
        fetch(`${this.domain}${url}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-info": JSON.stringify(this.info),
            "x-access-token": this.token,
          },
          body: data,
        }).then((res) => {
          resolve(res);
        });
      } catch (error) {
        reject("发生错误!");
      }
    });
  }
}
