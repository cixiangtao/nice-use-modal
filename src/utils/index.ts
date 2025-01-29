/*
 * @LastEditTime: 2023-08-30 18:05:45
 * @Description:
 * @Date: 2023-08-30 18:05:29
 * @Author: @周星星同学
 */
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
