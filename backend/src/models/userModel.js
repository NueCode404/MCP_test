const db = require('../config/db');

class User {
  // 取得所有使用者 (只返回未刪除的)
  static async getAllUsers() {
    try {
      const [rows] = await db.query('SELECT * FROM user WHERE deleted = 0 ORDER BY id');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // 根據ID取得單一使用者 (只返回未刪除的)
  static async getUserById(userId) {
    try {
      const [rows] = await db.query('SELECT * FROM user WHERE id = ? AND deleted = 0', [userId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // 創建新使用者
  static async createUser(userData) {
    try {
      const { name, email, phone } = userData;
      const [result] = await db.query(
        'INSERT INTO user (name, email, phone, deleted) VALUES (?, ?, ?, 0)',
        [name, email, phone]
      );
      
      return {
        id: result.insertId,
        name,
        email,
        phone,
        deleted: 0
      };
    } catch (error) {
      throw error;
    }
  }

  // 更新使用者
  static async updateUser(userId, userData) {
    try {
      const { name, email, phone } = userData;
      
      // 先檢查使用者是否存在且未被刪除
      const user = await this.getUserById(userId);
      if (!user) return null;
      
      // 更新使用者資料
      await db.query(
        'UPDATE user SET name = ?, email = ?, phone = ? WHERE id = ? AND deleted = 0',
        [name, email, phone, userId]
      );
      
      return { id: userId, name, email, phone, deleted: 0 };
    } catch (error) {
      throw error;
    }
  }

  // 軟刪除使用者 (設置deleted = 1)
  static async deleteUser(userId) {
    try {
      // 先檢查使用者是否存在且未被刪除
      const user = await this.getUserById(userId);
      if (!user) return false;
      
      // 軟刪除使用者 (設置deleted標記)
      await db.query('UPDATE user SET deleted = 1 WHERE id = ?', [userId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 恢復已刪除的使用者
  static async restoreUser(userId) {
    try {
      // 檢查使用者是否存在 (包括已刪除的)
      const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
      const user = rows[0];
      if (!user) return false;
      
      // 恢復使用者 (設置deleted = 0)
      await db.query('UPDATE user SET deleted = 0 WHERE id = ?', [userId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 永久刪除使用者 (僅供系統管理使用)
  static async permanentlyDeleteUser(userId) {
    try {
      await db.query('DELETE FROM user WHERE id = ?', [userId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 產生虛擬資料（與原始程式碼類似的邏輯）
  static generateUserData(userId, userName) {
    const jobTitle = ['軟體工程師', '專案經理', '行銷專員', '產品設計師', '人力資源專員', '業務代表', '財務分析師', '客服代表', '系統管理員', '資料科學家'];
    const department = ['研發部', '行銷部', '人力資源部', '財務部', '客戶服務部', '銷售部', '產品設計部', '資訊部', '法務部', '行政部'];
    const location = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '新竹市', '嘉義市', '彰化縣', '宜蘭縣'];
    
    // 用使用者ID作為隨機種子
    const seed = userId;
    const randomIndex = (array) => array[seed % array.length];
    
    return {
      job_title: randomIndex(jobTitle),
      department: randomIndex(department),
      location: randomIndex(location),
      join_date: new Date(new Date().setDate(new Date().getDate() - (seed * 10) % 1500)).toISOString().split('T')[0],
      employee_id: 'EMP' + String(userId).padStart(4, '0'),
      website: `https://www.example.com/${userName.toLowerCase().replace(/\s/g, '')}`,
      office: '分機 ' + (1000 + seed % 9000),
      birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 20 - (seed % 40))).toISOString().split('T')[0],
      address: `${randomIndex(location)}${seed % 30 + 1}區${seed % 100 + 1}路${seed % 200 + 1}號`
    };
  }
}

module.exports = User; 