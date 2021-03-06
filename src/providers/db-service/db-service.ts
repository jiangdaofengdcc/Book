import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DbServiceProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DbServiceProvider {
  database: SQLiteObject;

  constructor(private sqlite: SQLite) {
    this.initDB(function callback(result) {
    })
  }
  //初始化数据库
  initDB(callback) {
    if (!this.database) {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('create table if not exists sportDB(id INTEGER PRIMARY KEY AUTOINCREMENT,sportTime text NOT NULL,sportDate text NOT NULL)', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
        this.database = db;
        callback(true, db)
      }).catch(e => {
        console.log(e);
        callback(false, e)
      });
    } else {
      callback(true, this.database)
    }
  }
  //查询  
  queryList(sql: string = "", callback) {
    let list = [];
    this.initDB(function call(res, DB) {
      if (res) {
        DB.executeSql(sql, []).then((data) => {
          // data.rows.forEach(item => {
          //   list.push(item);
          //   callback(list);
          // });
          for (let i = 0; i < data.rows.length; i++) {
            // var element = data.rows[i];
            list.push(data.rows.item(i));
          }
          callback(list);
        }).catch(e => {
          console.log(e);
          callback(list);
        });
      }
    })
  }
  /**
   * 插入数据
   * @param param0 
   * @param call 回调函数
   */
  insert({ time, date }, call) {
    this.delete(date, function callback(res, DB) {
      DB.executeSql("INSERT  INTO sportDB (sportTime,sportDate) VALUES (?,?) ;"
        , [time + "", date])
        .then(() => {
          console.log('插入成功');
          call(true)
        })
        .catch(e => {
          console.log('插入失败');
          call(false, e)
        });//插入数据
    });
  }
  /**
   * 删除数据
   * @param date 删除条件
   * @param call 回调函数
   */
  delete(date: string = "", call) {
    this.initDB(function callback(res, DB) {
      if (res) {
        DB.executeSql("DELETE FROM sportDB WHERE sportDate = (?);"
          , [date])
          .then(() => {
            console.log('删除成功');
            call(true, DB)
          })
          .catch(e => {
            console.log('删除失败');
            call(false, DB, e)
          });//插入数据
      }
    })
  }
  /**
   * 更新数据
   * @param time 
   * @param call 
   */
  update(time: string = "", call) {
    this.initDB(function callback(res, DB) {
      if (res) {
        DB.executeSql("update  sportDB WHERE sportTime = (?);"
          , [time])
          .then(() => {
            console.log('删除成功');
            call(true, DB)
          })
          .catch(e => {
            console.log('删除失败');
            call(false, DB, e)
          });//插入数据
      }
    })
  }
}
