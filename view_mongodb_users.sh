#!/bin/bash

###############################################################################
# Script to View Users in MongoDB
# 
# This script provides various ways to view user data from MongoDB
#
# Usage: ./view_mongodb_users.sh [command]
# Commands:
#   all          - View all users (default)
#   officers     - View only officers
#   judges       - View only judges
#   lawyers      - View only lawyers
#   count        - Count users by role
#   <email>      - View specific user by email
###############################################################################

DB_NAME="trustchain"
COMMAND=${1:-"all"}

echo "🔍 MongoDB User Viewer"
echo "============================"
echo "Database: $DB_NAME"
echo ""

case "$COMMAND" in
  "all")
    echo "📋 All Users:"
    echo ""
    mongosh "$DB_NAME" --quiet --eval "
      db.users.find().forEach(user => {
        print('👤 ' + user.name);
        print('   Email: ' + user.email);
        print('   Role: ' + user.role);
        print('   Wallet: ' + (user.walletAddress || 'Not set'));
        print('   Created: ' + user.createdAt);
        print('');
      });
    "
    ;;
    
  "officers")
    echo "👮 Officers:"
    echo ""
    mongosh "$DB_NAME" --quiet --eval "
      db.users.find({role: 'officer'}).forEach(user => {
        print('👤 ' + user.name);
        print('   Email: ' + user.email);
        print('   Wallet: ' + (user.walletAddress || 'Not set'));
        print('');
      });
    "
    ;;
    
  "judges")
    echo "⚖️  Judges:"
    echo ""
    mongosh "$DB_NAME" --quiet --eval "
      db.users.find({role: 'judge'}).forEach(user => {
        print('👤 ' + user.name);
        print('   Email: ' + user.email);
        print('   Wallet: ' + (user.walletAddress || 'Not set'));
        print('');
      });
    "
    ;;
    
  "lawyers")
    echo "⚖️  Lawyers:"
    echo ""
    mongosh "$DB_NAME" --quiet --eval "
      db.users.find({role: 'lawyer'}).forEach(user => {
        print('👤 ' + user.name);
        print('   Email: ' + user.email);
        print('   Wallet: ' + (user.walletAddress || 'Not set'));
        print('');
      });
    "
    ;;
    
  "count")
    echo "📊 User Count by Role:"
    echo ""
    mongosh "$DB_NAME" --quiet --eval "
      db.users.aggregate([
        {\$group: {_id: '\$role', count: {\$sum: 1}}},
        {\$sort: {count: -1}}
      ]).forEach(role => {
        print(role._id + ': ' + role.count + ' user(s)');
      });
      print('');
      print('Total: ' + db.users.countDocuments() + ' users');
    "
    ;;
    
  *)
    # Try to find user by email
    echo "🔍 Searching for user: $COMMAND"
    echo ""
    mongosh "$DB_NAME" --quiet --eval "
      const user = db.users.findOne({email: '$COMMAND'});
      if (user) {
        print('👤 User Found:');
        print('   Name: ' + user.name);
        print('   Email: ' + user.email);
        print('   Role: ' + user.role);
        print('   Wallet Address: ' + (user.walletAddress || 'Not set'));
        print('   Active: ' + (user.isActive !== false ? 'Yes' : 'No'));
        print('   Created: ' + user.createdAt);
        print('   Updated: ' + user.updatedAt);
        print('   MongoDB ID: ' + user._id);
      } else {
        print('❌ User not found');
      }
    "
    ;;
esac

echo ""
echo "💡 Tips:"
echo "   ./view_mongodb_users.sh all        - View all users"
echo "   ./view_mongodb_users.sh officers   - View officers only"
echo "   ./view_mongodb_users.sh judges     - View judges only"
echo "   ./view_mongodb_users.sh lawyers    - View lawyers only"
echo "   ./view_mongodb_users.sh count      - Count by role"
echo "   ./view_mongodb_users.sh user@email.com - Find specific user"

