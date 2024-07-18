const findLastChildReply = (message, currentReplyId) => {
  console.log(`====================findLastChildReply====================`)
  //   console.log(`message: ${JSON.stringify(message, null, 2)}`)
  console.log(`currentReplyId: ${JSON.stringify(currentReplyId, null, 2)}`) // console.log(`message.replies: ${JSON.stringify(message.replies)}`)

  // Iterate through each reply in the message
  for (const reply of message.replies) {
    // Check if the current reply has nested replies
    console.log(`reply:${JSON.stringify(reply, null, 2)}`)
    console.log(`comparison: ${reply.parentId} === ${currentReplyId}`)

    if (reply.replies && reply.replies.length > 0) {
      console.log('replies exist...')
      // Recursively search in nested replies

      const nestedFound = findLastChildReply(reply, currentReplyId) // If a match is found in nested replies, return it
      console.log('nestedFound:', nestedFound)

      if (nestedFound) {
        return nestedFound
      }
    } else {
      console.log(`ran out of replies: ${JSON.stringify(reply, null, 2)}`)
      // if (reply.parentId === currentReplyId || reply.parentId == null) {
      // If the parentId matches, return this reply
      return reply
    } // Note: No need for else case if there are no nested replies to search
  } // If no match is found in the current message and all its replies, return null
  return null
}
export { findLastChildReply }
