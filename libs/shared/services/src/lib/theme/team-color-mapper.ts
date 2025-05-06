export class TeamColorMapper {
  static mapTeamIdToColor(name: string): string {
    switch (name) {
      case 'mclaren':
        return '#FF8000';
      case 'mercedes':
        return '#27F4D2';
      case 'red_bull':
        return '#3671C6';
      case 'ferrari':
        return '#E80020';
      case 'williams':
        return '#1868DB';
      case 'haas':
        return '#B6BABD';
      case 'aston_martin':
        return '#229971';
      case 'rb':
        return '#6692FF';
      case 'alpine':
        return '#00A1E8';
      case 'sauber':
        return '#52E252';
      default:
        return '#000'
    }
  }
}
