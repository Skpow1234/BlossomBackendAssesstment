import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

export class LocationModel extends Model {
  public id!: string;
  public rickAndMortyId!: number;
  public name!: string;
  public type!: string;
  public dimension!: string;
  public residents!: string[];
  public url!: string;
  public created!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LocationModel.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dimension: {
      type: DataTypes.STRING,
      allowNull: false
    },
    residents: {
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
    tableName: 'locations',
    modelName: 'Location'
  }
);

export default LocationModel; 