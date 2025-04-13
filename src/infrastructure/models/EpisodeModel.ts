import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class EpisodeModel extends Model {
  public id!: string;
  public rickAndMortyId!: number;
  public name!: string;
  public airDate!: string;
  public episode!: string;
  public characters!: string[];
  public url!: string;
  public created!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EpisodeModel.init(
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
    airDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    episode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    characters: {
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
    tableName: 'episodes',
    modelName: 'Episode'
  }
);

export default EpisodeModel; 