import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для управления пунктами выдачи'''
    
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
            query_params = event.get('queryStringParameters') or {}
            country = query_params.get('country')
            
            if country:
                cur.execute('''
                    SELECT id, name, country, city, address, phone, working_hours, is_active
                    FROM pickup_points
                    WHERE country = %s AND is_active = true
                    ORDER BY city, name
                ''', (country,))
            else:
                cur.execute('''
                    SELECT id, name, country, city, address, phone, working_hours, is_active
                    FROM pickup_points
                    WHERE is_active = true
                    ORDER BY country, city, name
                ''')
            
            points = []
            for row in cur.fetchall():
                points.append({
                    'id': row[0],
                    'name': row[1],
                    'country': row[2],
                    'city': row[3],
                    'address': row[4],
                    'phone': row[5],
                    'working_hours': row[6],
                    'is_active': row[7]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'points': points}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO pickup_points (name, country, city, address, phone, working_hours, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                data['name'],
                data['country'],
                data['city'],
                data['address'],
                data.get('phone'),
                data.get('working_hours'),
                data.get('is_active', True)
            ))
            
            point_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': point_id}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            point_id = data.get('id')
            
            cur.execute('''
                UPDATE pickup_points
                SET name = %s, country = %s, city = %s, address = %s, 
                    phone = %s, working_hours = %s, is_active = %s
                WHERE id = %s
            ''', (
                data['name'],
                data['country'],
                data['city'],
                data['address'],
                data.get('phone'),
                data.get('working_hours'),
                data.get('is_active', True),
                point_id
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
