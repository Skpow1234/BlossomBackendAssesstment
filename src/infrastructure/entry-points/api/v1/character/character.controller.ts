import { Router } from 'express';
import { CharacterService } from '../../../../domain/services/character/CharacterService';

/**
 * @swagger
 * tags:
 *   name: Characters
 *   description: Character management endpoints
 */

export class CharacterController {
  private router: Router;
  private characterService: CharacterService;

  constructor(characterService: CharacterService) {
    this.router = Router();
    this.characterService = characterService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /api/v1/characters:
     *   get:
     *     summary: Get all characters
     *     tags: [Characters]
     *     responses:
     *       200:
     *         description: List of characters
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Character'
     */
    this.router.get('/', async (req, res) => {
      try {
        const characters = await this.characterService.getAllCharacters();
        res.json(characters);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    /**
     * @swagger
     * /api/v1/characters/{id}:
     *   get:
     *     summary: Get a character by ID
     *     tags: [Characters]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Character found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Character'
     *       404:
     *         description: Character not found
     */
    this.router.get('/:id', async (req, res) => {
      try {
        const character = await this.characterService.getCharacterById(req.params.id);
        if (!character) {
          return res.status(404).json({ error: 'Character not found' });
        }
        res.json(character);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Add other routes with Swagger documentation here
  }

  public getRouter(): Router {
    return this.router;
  }
} 