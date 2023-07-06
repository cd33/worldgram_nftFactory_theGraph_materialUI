import { Address } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";

export function userId(userAddress: Address): string {
  return "User".concat(userAddress.toHexString());
}

export function ensureNewUser(id: string): User {
  //It is the entity ID not the questionId
  let user = User.load(id);

  if (user) {
    return user;
  } else {
    user = new User(id);
    user.save();
    return user;
  }
}
