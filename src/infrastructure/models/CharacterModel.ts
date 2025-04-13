import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class CharacterModel extends Model {
  public id!: string;
  public rickAndMortyId!: number;
  public name!: string;
  public status!: string;
  public species!: string;
  public type!: string;
  public gender!: string;
  public origin!: string;
  public location!: string;
  public image!: string;
  public episode!: string[];
  public url!: string;
  public created!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CharacterModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    rickAndMortyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    species: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    episode: {
      type: DataTypes.JSON,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'characters',
    modelName: 'Character'
  }
);

export default CharacterModel; 