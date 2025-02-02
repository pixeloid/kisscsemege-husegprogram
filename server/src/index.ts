import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5100;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kisscsemege Husegprogram API',
      version: '1.0.0',
      description: 'API documentation for Kisscsemege Husegprogram',
    },
    servers: [
      {
        url: `https://kisscsemege-husegprogram.onrender.com:${PORT}`,
      },
    ],
  },
  apis: ['./src/index.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Auth routes
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               pinCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                 session:
 *                   type: object
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, phoneNumber, pinCode } = req.body;
    const randomEmail = `${Date.now()}-${Math.random().toString(36).substring(2)}@temp.com`;

    console.log('Attempting signup with email:', randomEmail);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: randomEmail,
      password: `PIN-${pinCode}`,
      options: { data: { name, phone_number: phoneNumber } }
    });

    if (authError) throw authError;

    console.log('Auth Data:', authData);

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{ user_id: authData.user.id, pin: pinCode, name, phone_number: phoneNumber }]);

      if (profileError) {
        console.error('Profile Insert Error:', profileError);
        throw profileError;
      }
    }

    res.json(authData);
  } catch (error) {
    console.error('Signup Error:', error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               pinCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                 session:
 *                   type: object
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { phoneNumber, pinCode } = req.body;

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('phone_number', phoneNumber)
      .single();

    if (profileError) throw profileError;

    const { data: authUser, error: userError } = await supabase
      .auth.admin.getUserById(profile.user_id);

    if (userError) throw userError;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authUser.user.email!,
      password: `PIN-${pinCode}`,
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// User routes
/**
 * @swagger
 * /api/users/{userId}/profile:
 *   get:
 *     summary: Get user profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select()
      .eq('user_id', req.params.userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/{userId}/level:
 *   get:
 *     summary: Get user level
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User level retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 level:
 *                   type: string
 *                 points:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
app.get('/api/users/:userId/level', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_levels')
      .select()
      .eq('user_id', req.params.userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

// Purchase routes
/**
 * @swagger
 * /api/users/{userId}/purchases:
 *   get:
 *     summary: Get user purchases
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User purchases retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   total_amount:
 *                     type: number
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                   receipt_number:
 *                     type: string
 *                   purchase_date:
 *                     type: string
 *                     format: date-time
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
app.get('/api/users/:userId/purchases', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select()
      .eq('user_id', req.params.userId)
      .order('purchase_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/purchases:
 *   post:
 *     summary: Create a new purchase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               receiptNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purchase created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */
app.post('/api/purchases', async (req, res) => {
  try {
    const { userId, totalAmount, items, receiptNumber } = req.body;
    const { error } = await supabase
      .from('purchases')
      .insert([{
        user_id: userId,
        total_amount: totalAmount,
        items,
        receipt_number: receiptNumber,
        purchase_date: new Date(),
        created_at: new Date()
      }]);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/barcode/{barcode}:
 *   get:
 *     summary: Get user by barcode
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 points:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
app.get('/api/barcode/:barcode', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_data_by_barcode', { barcode_input: req.params.barcode })
      .maybeSingle();
    console.log(data);
    if (error) throw error;
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});