import db from '../Models/AgroConnectMitr.js'; 

export const contactController = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const result = await db.query(
      'INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message]
    );
    console.log('Contact message saved:', result);
    res.json({ success: true, message: 'Message received successfully!' });
  } catch (error) {
    console.error('Error in contactController:', error);
    res.status(500).json({ success: false, message: 'Failed to process your message.' });
  }
};

// import db from '../Models/AgroConnectMitr.js';

// export const contactController = async (req, res) => {
//  try {
//     const { name, email, subject, message } = req.body;
//     const result = await db.query(
//       'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
//       [name, email, subject, message]
//     );
//     console.log('Contact message saved:', result);
//     res.json({ success: true, message: 'Message received successfully!' });
//   } catch (error) {
//     console.error('Error in contactController:', error);
//     res.status(500).json({ success: false, message: 'Failed to process your message.' });
//   }
// };