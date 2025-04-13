import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import CharacterModel from './CharacterModel';
import EpisodeModel from './EpisodeModel';

export class CharacterEpisodeModel extends Model {
  public id!: string;
  public characterId!: string;
  public episodeId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CharacterEpisodeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    characterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CharacterModel,
        key: 'id'
      }
    },
    episodeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: EpisodeModel,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'character_episodes',
    modelName: 'CharacterEpisode'
  }
);

// Define relationships
CharacterModel.belongsToMany(EpisodeModel, {
  through: CharacterEpisodeModel,
  foreignKey: 'characterId',
  otherKey: 'episodeId'
});

EpisodeModel.belongsToMany(CharacterModel, {
  through: CharacterEpisodeModel,
  foreignKey: 'episodeId',
  otherKey: 'characterId'
});

export default CharacterEpisodeModel; 