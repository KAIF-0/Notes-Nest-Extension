import { Storage } from "@plasmohq/storage"

class StorageManager {
  public storage: Storage

  constructor() {
    this.storage = new Storage({
      area: "local",
      copiedKeyList: ["shield-modulation"]
    })
  }

//   async get() {
//     return this.storage
//   }
}

export default new StorageManager()
