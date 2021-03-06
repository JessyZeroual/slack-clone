const pg = require('pg');

const databaseUrl = process.env.DATABASE_URL;
const pool = new pg.Pool({
  connectionString: databaseUrl,
});

const createMessage = async (text, userId, channelId, extraInfo) => {
  const seenBy = `{${userId}}`;
  const result = await pool.query(
    'INSERT INTO message (text, user_id, channel_id, extra_info, seen_by) VALUES($1, $2, $3, $4, $5)  RETURNING *',
    [text, userId, channelId, extraInfo, seenBy]
  );
  return result.rows[0];
};

const getMessage = async messageId => {
  const result = await pool.query(
    `
    SELECT message.id, message.text, message.created_at, message.channel_id, users.username, users.id as user_id, extra_info, seen_by, avatar_url
    FROM message
    JOIN users
    ON message.user_id = users.id
    WHERE message.id = $1
  `,
    [messageId]
  );
  return result.rows[0];
};

const getMessages = async () => {
  const result = await pool.query(`SELECT * FROM message`);
  return result.rows;
};

const getMessagesByChannelId = async (channelId, limit, offset) => {
  const messages = await pool.query(
    `SELECT message.id, message.text, message.created_at, message.channel_id, users.username, users.id as user_id, extra_info, seen_by, avatar_url
              FROM message
              JOIN users
              ON message.user_id = users.id
              WHERE channel_id=($1) 
              ORDER BY message.created_At DESC 
              LIMIT ($2) 
              OFFSET ($3) `,
    [channelId, limit, offset]
  );

  return messages.rows;
};

const getNotificationsByChannels = async userId => {
  const messages = await pool.query(
    `SELECT channel_id, COUNT(channel_id)
      FROM message
      WHERE NOT ($1 = ANY (seen_by))
      GROUP BY channel_id`,
    [userId]
  );

  return messages.rows;
};

const getMessagesNotSeen = async (userId, channelId) => {
  const messages = await pool.query(
    `SELECT id, channel_id
      FROM message
      WHERE NOT ($1 = ANY (seen_by))
      AND channel_id=($2)`,
    [userId, channelId]
  );

  return messages.rows;
};

const hasSeenMessage = async (userId, messageId) => {
  const result = await pool.query(
    `UPDATE message 
     SET seen_by = array_append(seen_by, $1)
     WHERE id = $2`,
    [userId, messageId]
  );
  return result.rows[0];
};

const deleteMessage = async id => {
  await pool.query(`DELETE FROM message WHERE id = $1`, [id]);
};

module.exports = {
  createMessage,
  getMessages,
  getMessagesByChannelId,
  getMessagesNotSeen,
  getNotificationsByChannels,
  getMessage,
  hasSeenMessage,
  deleteMessage,
};
