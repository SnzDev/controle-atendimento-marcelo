export const getWid = (number: string) => {
  number = number.replace(/\D/g, "");
  return `${number.includes("@c.us")
    ? number
    : `${number.includes("55")
      ? number
      : `${number.includes("55") ? number : `55${number}`}`
    }@c.us`
    }`;
};