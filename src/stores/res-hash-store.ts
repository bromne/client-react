import * as Im from "immutable";
import { observable } from "mobx";
import { ResSeted } from "../models";
import {
  apiClient,
  list,
  resSetedCreate,
} from "../utils";
import { UserStore } from "./user-store";

export class ResHashStore {
  @observable data: { hash: string, reses: Im.List<ResSeted> } | null = null;
  @observable msg: null | string = null;

  constructor(private user: UserStore) { }

  async load(hash: string) {
    if (this.data === null || this.data.hash !== hash) {
      this.data = null;
      try {
        const token = this.user.data !== null ? this.user.data.token : null;
        this.data = {
          reses: Im.List(await resSetedCreate.resSet(token, await apiClient.findResHash(token, {
            hash: hash,
          }))),
          hash,
        };
      } catch {
        this.msg = "レス取得に失敗しました";
      }
    }
  }

  update(res: ResSeted) {
    if (this.data !== null) {
      this.data.reses = list.update(this.data.reses, res);
    }
  }

  clearMsg() {
    this.msg = null;
  }
}
