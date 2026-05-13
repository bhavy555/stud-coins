import User from "./User.js"
import Wallet from "./Wallet.js"
import Transaction from "./Transaction.js"
import ApprovalRequest from "./ApprovalRequest.js"
import Log from "./Log.js"

// ✅ RELATIONS HERE ONLY
User.hasOne(Wallet)
Wallet.belongsTo(User)

export {
  User,
  Wallet,
  Transaction,
  ApprovalRequest,
  Log

}

export default { User, Wallet, Transaction, ApprovalRequest, Log }