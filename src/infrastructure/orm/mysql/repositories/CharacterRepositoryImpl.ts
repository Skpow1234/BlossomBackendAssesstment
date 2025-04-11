import { Model, DataTypes } from 'sequelize';
import { CharacterRepository } from '../../../../repositories/CharacterRepository';
import { sequelize } from '../config/sequelize';

class CharacterModel extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CharacterModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'characters',
    timestamps: true,
  }
);

export class CharacterRepositoryImpl implements CharacterRepository {
  async findAll(): Promise<any[]> {
    return CharacterModel.findAll();
  }

  async findById(id: string): Promise<any> {
    return CharacterModel.findByPk(id);
  }

  async create(character: any): Promise<any> {
    return CharacterModel.create(character);
  }

  async update(id: string, character: any): Promise<any> {
    const [affectedCount] = await CharacterModel.update(character, {
      where: { id },
    });
    if (affectedCount === 0) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await CharacterModel.destroy({
      where: { id },
    });
  }
} 