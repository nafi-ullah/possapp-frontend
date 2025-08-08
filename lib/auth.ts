"use client";

import Cookies from "js-cookie";
import type { LoginPayload, LoginResponse } from "./types";
import { BackendBaseUrl } from "./constants";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await fetch(`${BackendBaseUrl}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data: LoginResponse = await res.json();

  Cookies.set("accessToken", data.accessToken, { expires: 7 });
  Cookies.set("userId", String(data.userId), { expires: 7 });
  Cookies.set("username", data.username, { expires: 7 });
  Cookies.set("role", data.role, { expires: 7 });
  Cookies.set("isActive", String(data.isActive), { expires: 7 });

  return data;
};

export const getAccessToken = () => Cookies.get("accessToken");
export const getRole = () => Cookies.get("role");
