import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для управления статусами заказов'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('''
                SELECT id, name, color, description, order_position
                FROM order_statuses
                ORDER BY order_position
            ''')
            
            statuses = []
            for row in cur.fetchall():
                statuses.append({
                    'id': row[0],
                    'name': row[1],
                    'color': row[2],
                    'description': row[3],
                    'order_position': row[4]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'statuses': statuses}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cur.execute('SELECT MAX(order_position) FROM order_statuses')
            max_position = cur.fetchone()[0] or 0
            
            cur.execute('''
                INSERT INTO order_statuses (name, color, description, order_position)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            ''', (
                data['name'],
                data.get('color', '#0EA5E9'),
                data.get('description'),
                max_position + 1
            ))
            
            status_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': status_id}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            status_id = data.get('id')
            
            cur.execute('''
                UPDATE order_statuses
                SET name = %s, color = %s, description = %s
                WHERE id = %s
            ''', (
                data['name'],
                data['color'],
                data.get('description'),
                status_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
